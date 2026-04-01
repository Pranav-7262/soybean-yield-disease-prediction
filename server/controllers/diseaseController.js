import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const detectDisease = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        const imageBase64 = req.file.buffer.toString('base64');
        const scriptPath = path.join(__dirname, '../../ml-service/services/disease_service.py');
        const python = spawn('python', [scriptPath]);

        python.stdin.write(JSON.stringify({ image: imageBase64 }));
        python.stdin.end();

        let dataString = '';
        let errorString = '';

        python.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        python.stderr.on('data', (data) => {
            errorString += data.toString();
        });

        python.on('close', (code) => {
            if (code !== 0) {
                console.error("Python Error:", errorString);
                return res.status(500).json({ error: "Machine Learning service failed" });
            }

            try {
                const result = JSON.parse(dataString);
                res.status(200).json(result);
            } catch (e) {
                res.status(500).json({ error: "Invalid response from ML service" });
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};