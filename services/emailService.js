const nodemailer = require("nodemailer");
const db = require("../database/db");
const { buscarCoordenadas, buscarQualidadeDoAr, gerarRecomendacao } = require("./weatherService");

require("dotenv").config();

// Configuração do Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'airtrackinfos@gmail.com',
        pass: 'rfycfqncqyouqdbd'
    },
});

// Envia e-mails personalizados baseados na qualidade do ar da cidade do usuário.
async function sendEmails() {
    return new Promise((resolve, reject) => {
        db.all("SELECT email, cidade FROM emails", async (err, rows) => {
            if (err) {
                console.error("Erro ao buscar emails:", err);
                reject(err);
                return;
            }

            let resultados = [];

            for (const row of rows) {
                console.log(`📡 Buscando dados para ${row.cidade}...`);

                // Buscar coordenadas da cidade
                const coord = await buscarCoordenadas(row.cidade);
                if (!coord) {
                    console.error(`❌ Não foi possível encontrar coordenadas para ${row.cidade}`);
                    continue;
                }

                // Buscar qualidade do ar (AQI)
                const aqi = await buscarQualidadeDoAr(coord.lat, coord.lon);
                if (!aqi) {
                    console.error(`❌ Falha ao obter dados de qualidade do ar para ${row.cidade}`);
                    continue;
                }

                // Gerar recomendação
                const recomendacao = gerarRecomendacao(aqi);

                try {
                    await transporter.sendMail({
                        from: process.env.EMAIL_USER,
                        to: row.email,
                        subject: `🌎 Atualização da Qualidade do Ar em ${row.cidade}`,
                        text: `Olá,\n\nAqui estão os dados atualizados para sua cidade (${row.cidade}):\n\n- Qualidade do ar: ${aqi}/5\n- Umidade: ${coord.humidity}%\n- Recomendação: ${recomendacao}\n\nFique atento às condições do ar!\n\nAtenciosamente,\nEquipe AirTrack.`,
                    });

                    console.log(`✅ E-mail enviado para ${row.email} - ${row.cidade}`);
                    resultados.push({ email: row.email, cidade: row.cidade, status: "Enviado" });
                } catch (error) {
                    console.error(`❌ Erro ao enviar para ${row.email} (${row.cidade}):`, error.message);
                    resultados.push({ email: row.email, cidade: row.cidade, status: "Erro", motivo: error.message });
                }
            }

            resolve(resultados);
        });
    });
}

module.exports = { sendEmails };
