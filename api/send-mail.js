import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // iSpring mengirimkan data dengan metode POST
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  try {
    const data = req.body; // Berisi variabel skor, nama, dll dari iSpring

    await resend.emails.send({
      from: 'Quiz-System <onboarding@resend.dev>',
      to: 'discordpapp@gmail.com',
      subject: `Hasil Quiz: ${data.sn || 'Peserta'}`,
      html: `
        <h1>Hasil Quiz Baru</h1>
        <p><b>Nama:</b> ${data.sn || 'Anonymous'}</p>
        <p><b>Skor:</b> ${data.sp} poin</p>
        <p><b>Persentase:</b> ${data.ps}%</p>
        <p><b>Status:</b> ${data.st === 'passed' ? 'LULUS' : 'GAGAL'}</p>
      `
    });

    return res.status(200).json({ message: 'Email sent!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}