import 'dotenv/config';
import nodemailer from 'nodemailer';

// envia e-mail de primeiro acesso ou de recuperação de senha
export async function enviarEmailDefinicaoSenha(email, token, tipoEmail = 'registro') {
    const link = `http://${process.env.FRONT_HOST}:${process.env.FRONT_PORT}/definir-senha?token=${token}`;

    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT, 10),
        // mailpit não precisa de segurança pois é local
        secure: false,
    });

    let subject = null;
    let mensagem = null;

    if (tipoEmail == 'registro') {
        subject = 'Criação de Senha - Primeiro Acesso';
        mensagem = `
            <h1>Bem-vindo à Clínica de Cardiologia!</h1>
            <p>Um funcionário acabou de cadastrar você em nosso sistema.</p>
        `;
    } else {
        subject = 'Redefinição de Senha';
        mensagem = `
            <h1>Olá!</h1>
            <p>Estamos enviando esse e-mail pois você solicitou a alteração de sua senha da Clínica de Cardiologia.</p>
            <p>Se não foi você quem solicitou a mudança de senha, ignore.</p>
        `;
    }

    const info = await transporter.sendMail({
        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
        to: email,
        subject: subject,
        html: `
            ${mensagem}
            <p>Para criar sua senha de acesso, clique no link abaixo:</p>
            <a href="${link}" style="color: #007bff; font-weight: bold; text-decoration: none;">Definir minha senha</a>
            <br><br>
            <small>Atenção: Este link expira em 24 horas a partir da data de envio do e-mail. Além disso, ele não será mais válido se forem feitas novas tentativas de recuperação da senha.</small>
        `,
    });

    return 'E-mail para definir a senha enviado! Verifique em http://localhost:8025';
}
