import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../db/db.json');

// שליפת כל המתכונים
router.get('/', (req, res) => {
    const db = JSON.parse(fs.readFileSync(dbPath));
    res.json(db.recipes);
});

// הוספת מתכון ללא אימות
router.post('/add', (req, res) => {
    const { title, description, details, authorId } = req.body;
    const db = JSON.parse(fs.readFileSync(dbPath));

    // יצירת המתכון החדש
    const newRecipe = {
        id: Date.now(),
        title,
        description,
        details,
        authorId,  // אם אין צורך בטוקן, תוכל לשלוח את ה-authorId גם מהלקוח (במידה וצריך)
    };

    // הוספת המתכון לדאטה
    db.recipes.push(newRecipe);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    // הוספת הכותרת CORS כדי לאפשר גישה מכל מקור
    res.setHeader("Access-Control-Allow-Origin", "*");

    // החזרת תשובה מוצלחת
    res.status(201).json({ message: "Recipe added", recipe: newRecipe });
});

export default router;
