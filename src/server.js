import { createServer } from 'http';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const SAVE_DIR = path.join(__dirname, '../saves');
const SAVE_SLOTS = ['autosave', 'slot1', 'slot2', 'slot3'];


async function ensureSaveFolder() {
  try {
    await fs.mkdir(SAVE_DIR, { recursive: true });
  } catch (err) {
    console.error('❌ Не вдалося створити папку saves:', err);
  }
}

function sendJSON(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
}

const server = createServer(async (req, res) => {
  await ensureSaveFolder();

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // ------------------ SAVE ------------------
  if (req.method === 'POST' && req.url.startsWith('/save')) {
    try {
      const body = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => (data += chunk));
        req.on('end', () => resolve(JSON.parse(data)));
        req.on('error', reject);
      });


      const {
        slot,
        level,
        maze,
        playerX,
        playerY,
        goalRow,
        goalCol,
        nextLevelBiome,
        currentBiome,
        chests,
        playerState
      } = body;


      if (!SAVE_SLOTS.includes(slot)) {
        return sendJSON(res, 400, { message: 'Невідомий слот збереження' });
      }


      const saveData = {
        level,
        maze,
        playerX,
        playerY,
        goalRow,
        goalCol,
        nextLevelBiome,
        currentBiome,
        timestamp: new Date().toISOString(),


        chests: Array.isArray(chests) ? chests.map(c => ({
          id: c.id,
          row: c.row,
          col: c.col,
          isOpen: c.isOpen ?? false,
          itemInside: c.itemInside ? {
            id: c.itemInside.id,
            name: c.itemInside.name,
            description: c.itemInside.description,
            type: c.itemInside.type
          } : null
        })) : [],

        playerState: playerState ? {
          health: playerState.health,
          maxHealth: playerState.maxHealth,
          armor: playerState.armor,
          damage: playerState.damage,
          inventory: Array.isArray(playerState.inventory)
            ? playerState.inventory.map(i => ({
              name: i.item.name,
              quantity: i.quantity ?? 1
            }))
            : []
        } : null

      };

      // 🔹 Зберігаємо у файл
      const filePath = path.join(SAVE_DIR, `${slot}.json`);
      await fs.writeFile(filePath, JSON.stringify(saveData, null, 2));

      // 🔹 Дублюємо в autosave.json
      const autoPath = path.join(SAVE_DIR, 'autosave.json');
      await fs.writeFile(autoPath, JSON.stringify(saveData, null, 2));

      return sendJSON(res, 200, { message: `✅ Збережено у ${slot}.json`, saveData });
    } catch (err) {
      console.error('❌ Помилка при збереженні:', err);
      return sendJSON(res, 500, { message: 'Помилка при збереженні' });
    }
  }


  // ------------------ LOAD ------------------
  if (req.method === 'GET' && req.url.startsWith('/load')) {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const slot = url.searchParams.get('slot') || 'autosave';

      if (!SAVE_SLOTS.includes(slot)) {
        return sendJSON(res, 400, { message: 'Невідомий слот' });
      }

      const filePath = path.join(SAVE_DIR, `${slot}.json`);

      const rawData = await fs.readFile(filePath, 'utf8');
      if (!rawData.trim()) {
        return sendJSON(res, 200, { message: 'Empty slot', data: null });
      }

      try {
        const data = JSON.parse(rawData);

        if (data.goalRow === undefined) data.goalRow = null;
        if (data.goalCol === undefined) data.goalCol = null;

        return sendJSON(res, 200, { message: 'OK', data });
      } catch {
        return sendJSON(res, 200, { message: 'Empty slot', data: null });
      }
    } catch {
      return sendJSON(res, 404, { message: 'Файл не знайдено', data: null });
    }
  }

  // ------------------ GET ALL SLOTS ------------------
  if (req.method === 'GET' && req.url === '/slots') {
    const results = [];

    for (const slot of SAVE_SLOTS) {
      const filePath = path.join(SAVE_DIR, `${slot}.json`);
      try {
        const rawData = await fs.readFile(filePath, 'utf8');
        if (!rawData.trim()) {
          results.push({ slot, message: 'Empty slot', hasSave: false });
          continue;
        }

        try {
          const data = JSON.parse(rawData);
          results.push({
            slot,
            level: data.level,
            timestamp: data.timestamp,
            hasSave: true
          });
        } catch {
          results.push({ slot, message: 'Empty slot', hasSave: false });
        }
      } catch {
        results.push({ slot, message: 'Empty slot', hasSave: false });
      }
    }

    return sendJSON(res, 200, { message: 'OK', slots: results });
  }

  // ------------------ NOT FOUND ------------------
  sendJSON(res, 404, { message: 'Not Found' });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🟢 Сервер запущено: http://localhost:${PORT}`);
  console.log(`📂 Шлях до збережень: ${SAVE_DIR}`);
});
