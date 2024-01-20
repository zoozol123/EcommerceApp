const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Sequelize, DataTypes, Op } = require('sequelize');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const app = express();

app.use(express.json());
app.use(session({
    secret: 'secret', // Dowolny sekretny klucz do podpisu ciasteczek sesji
    resave: false,
    saveUninitialized: true,
}));

// Ograniczanie liczby zapytań
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Połączenie z bazą danych MySQL
const sequelize = new Sequelize('ecommerce', 'root', 'Zoozol123#', {
    host: 'localhost',
    dialect: 'mysql'
});

// Definicje modeli
const User = sequelize.define('User', {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }
}, {
    timestamps: true, 
});

const Product = sequelize.define('Product', {
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    description: { type: DataTypes.TEXT }
}, {
    timestamps: true, 
});

const Order = sequelize.define('Order', {
    totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
});

const OrderProducts = sequelize.define('OrderProducts', {
    // Możesz dodać dodatkowe pola, jeśli są wymagane
});

// Relacje
User.hasMany(Order);
Order.belongsTo(User);
Product.belongsToMany(Order, { through: OrderProducts });
Order.belongsToMany(Product, { through: OrderProducts });

// Middleware do weryfikacji tokena
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(403).send('Wymagany jest token do autentykacji');
    }
    try {
        console.log('Przed dekodowaniem tokenu');
        const decoded = jwt.verify(token, 'secret');
        console.log('Po dekodowaniu tokenu:', decoded);
        req.session.user = {
            userId: decoded.userId,
        };
        next();
    } catch (err) {
        return res.status(401).send('Nieprawidłowy token');
    }
};

// Rejestracja użytkownika
app.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email }, { username }]
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Użytkownik o podanym adresie e-mail lub nazwie użytkownika już istnieje' });
        }

        const user = await User.create({ email, username, password: hashedPassword });
        res.status(201).json({ message: "Użytkownik zarejestrowany", userId: user.id });
    } catch (error) {
        res.status(400).send("error.message");
    }
});

// Logowanie użytkownika
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username } });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: 'Nieprawidłowe dane logowania' });
        }

        req.session.user = {
            userId: user.id,
            username: user.username,
        };

        const token = jwt.sign({ userId: user.id }, 'secret', { expiresIn: '1h' });
        res.json({ token });
        req.session.cart = [];
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Pobieranie listy produktów
app.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Wyświetlanie konkretnego produktu
app.get('/product/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;

        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Dodawanie produktu
app.post('/products', async (req, res) => {
    try {
        const { name, price, description } = req.body;

        const newProduct = await Product.create({
            name: name,
            price: price,
            description: description,
        });

        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Błąd podczas dodawania produktu:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// edycja produktu
app.put('/products/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const { newName, newPrice, newDescription } = req.body;

        const updatedProduct = await Product.update(
            {
                name: newName,
                price: newPrice,
                description: newDescription
            },
            { 
                where: { id: productId },
                returning: true, 
            }
        );

        if (updatedProduct[0] > 0) {
            res.json({ message: 'Produkt został zaktualizowany', updatedProduct: updatedProduct[1][0] });
        } else {
            res.status(404).json({ error: 'Produkt nie został znaleziony' });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Usuwanie produktu
app.delete('/products/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const deletedProduct = await Product.destroy({ where: { id: productId } });

        if (deletedProduct) {
            res.json({ message: 'Produkt został usunięty' });
        } else {
            res.status(404).json({ error: 'Produkt nie został znaleziony' });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Składanie zamówienia
app.post('/order', verifyToken, async (req, res) => {
    try {
        const { cart } = req.body; 
        const productIds = cart.map(item => item.productId);
        const products = await Product.findAll({ where: { id: productIds } });
        const totalAmount = cart.reduce((sum, cartItem) => sum + cartItem.quantity * cartItem.price, 0);

        const order = await Order.create({ totalAmount, UserId: req.session.user.userId });
        await order.addProducts(products.map(product => product.id));

        res.status(201).json({ message: 'Zamówienie złożone', orderId: order.id });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Pobieranie zamówień użytkownika
app.get('/orders', verifyToken, async (req, res) => {
    try {
        const orders = await Order.findAll({ 
            where: { UserId: req.user.userId },
            include: Product
        });
        res.json(orders);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Obsługa błędów
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Wystąpił błąd!');
});

// Synchronizacja i uruchomienie serwera
sequelize.sync().then(() => {
    app.listen(5000, () => {
        console.log("Serwer działa na porcie 5000");
    });
}).catch(err => console.error('Nie można połączyć się z bazą danych:', err));
