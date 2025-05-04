const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'arthunt.notificari@gmail.com',
    pass: 'imtnirepdogzotsw' 
  },
});


async function sendConfirmationEmail(toEmail, username) {
  const mailOptions = {
    from: 'ArtHunt <arthunt.notificari@gmail.com>',
    to: toEmail,
    subject: 'Bine ai venit în comunitatea ArtHunt!',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #6C3483;">Salut, ${username}!</h2>
        <p>Îți mulțumim că te-ai alăturat <strong>ArtHunt</strong>, platforma dedicată iubitorilor de artă contemporană și modernă.</p>
        <p>Contul tău a fost creat cu succes! Acum poți:</p>
        <ul>
          <li>💬 Comenta și interacționa cu artiștii preferați</li>
          <li>🛒 Adăuga lucrări în coș și plasa comenzi</li>
          <li>🎨 Descoperi expoziții și artiști pe gustul tău</li>
        </ul>
        <p>Suntem bucuroși să te avem alături!</p>
        <p style="margin-top: 30px;">– Echipa <strong>ArtHunt</strong></p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(' Email trimis cu succes către', toEmail);
  } catch (err) {
    console.error(' Eroare la trimiterea emailului:', err.message);
  }
}

// ✅ Email pentru resetare parolă
async function sendResetEmail(toEmail, username, link) {
  const mailOptions = {
    from: 'ArtHunt <arthunt.notificari@gmail.com>',
    to: toEmail,
    subject: 'Resetare parolă – ArtHunt',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #C0392B;">Resetare parolă</h2>
        <p>Salut, ${username}!</p>
        <p>Ai solicitat o resetare a parolei pentru contul tău ArtHunt.</p>
        <p>Pentru a continua, te rugăm să accesezi linkul de mai jos (valabil 15 minute):</p>
        <a href="${link}" style="display: inline-block; background-color: #6C3483; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Resetează parola
        </a>
        <p style="margin-top: 20px;">Dacă nu ai solicitat această acțiune, poți ignora acest email.</p>
        <p style="margin-top: 30px;">– Echipa <strong>ArtHunt</strong></p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Email de resetare trimis către', toEmail);
  } catch (err) {
    console.error('❌ Eroare la trimiterea emailului de resetare:', err.message);
  }
}

module.exports = {
  sendConfirmationEmail,
  sendResetEmail
};
