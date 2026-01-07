import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Tambahkan Header CORS agar diizinkan oleh browser
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Tangani permintaan pre-flight browser (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Pastikan hanya menerima POST
  if (req.method === 'POST') {
    try {
      // iSpring mengirim data di req.body
      const data = req.body;

      // Debug: Cek data di Logs Vercel
      console.log("Data Quiz Diterima:", data);

      await resend.emails.send({
        from: 'Quiz-System <onboarding@resend.dev>',
        to: 'discordpapp@gmail.com',
        subject: `Hasil Quiz: ${data.sn || 'Peserta'}`,
        html: `
          <h1>Hasil Quiz Baru</h1>
          <p><b>Nama:</b> ${data.sn || 'Anonymous'}</p>
          <p><b>Skor:</b> ${data.sp || 0}</p>
          <p><b>Passing Score:</b> ${data.ps || 0}%</p>
          <p><b>Status:</b> ${data.st === 'passed' ? 'LULUS' : 'GAGAL'}</p>
          <hr>
          <p><i>Data Mentah (Debug): ${JSON.stringify(data)}</i></p>
        `
      });

      return res.status(200).json({ message: 'Email sent!' });
    } catch (error) {
      console.error("Resend Error:", error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    // Memberikan info metode apa yang salah masuk
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}