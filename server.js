const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Change this password
const ADMIN_PASSWORD = "changeme";

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
  secret: 'shepherdsrest-secret-key',
  resave: false,
  saveUninitialized: true
}));

// storage for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// ✅ login endpoint
app.post('/login', (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) {
    req.session.authenticated = true;
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// ✅ middleware to protect admin actions
function checkAuth(req, res, next) {
  if (req.session.authenticated) {
    return next();
  }
  res.status(401).send("Unauthorized");
}

// ✅ secure routes
app.post('/upload-image', checkAuth, upload.single('image'), (req, res) => {
  res.json({ path: '/images/' + req.file.filename });
});

app.post('/update-content', checkAuth, (req, res) => {
  fs.writeFileSync(path.join(__dirname, 'public', 'content.json'), JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.listen(PORT, () => console.log(`✅ Shepherds Rest running at http://localhost:${PORT}`));
