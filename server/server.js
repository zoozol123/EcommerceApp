const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Sequelize, DataTypes, Op } = require('sequelize');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const app = express();

app.use(express.json());
app.use(session({
    secret: 'secret-key', // Dowolny sekretny klucz do podpisu ciasteczek sesji
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
        const decoded = jwt.verify(token, 'secret-key');
        req.session.user = {
            userId: decoded.userId,
            // Inne informacje o użytkowniku, które chcesz przechowywać
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

        const token = jwt.sign({ userId: user.id }, 'secret-key', { expiresIn: '1h' });
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

// Dodawanie produktu
app.post('/products', async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const product = await Product.create({ name, price, description });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Wyświetlanie konkretnego produktu
app.get('/product/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;

        // Pobierz produkt z bazy danych na podstawie ID
        const product = await Product.findByPk(productId);

        if (!product) {
            // Jeśli produkt o podanym ID nie został znaleziony
            return res.status(404).json({ error: 'Product not found' });
        }

        // Jeśli produkt został znaleziony, zwróć go w odpowiedzi
        res.json(product);
    } catch (error) {
        // Obsługa błędów
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Składanie zamówienia
app.post('/order', verifyToken, async (req, res) => {
    try {
        const { productIds } = req.body; // Array of product IDs
        const products = await Product.findAll({ where: { id: productIds } });
        const totalAmount = products.reduce((sum, product) => sum + product.price, 0);

        const order = await Order.create({ totalAmount, UserId: req.user.userId });
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
