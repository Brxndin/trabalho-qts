import nodemailer from 'nodemailer';

// envia e-mail de primeiro acesso ou de recuperação de senha
export async function enviarEmailDefinicaoSenha(email, token) {
    // # to do
    // esse link vai ser pro frontend, por isso é necessário não usar as variáveis e rotas iguais as do back
    // quando tiver o front, alterar
    const link = `http://${process.env.FRONT_HOST}:${process.env.FRONT_PORT}/criar-senha?token=${token}`;

    // # to do
    // após validar a senha OU o token expirar, importante apagar da tabela de recuperação de senhas

    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT, 10),
        // mailpit não precisa de segurança pois é local
        secure: false,
    });

    // # to do
    // verificar se tem como mandar uma view ou escrever esse html melhor
    // em string assim fica paia
    // verificar também pra mudar o layout quando for a opção de recuperar a senha
    // um layout genérico pros dois também resolve
    const info = await transporter.sendMail({
        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
        to: email,
        subject: 'Criação de Senha - Primeiro Acesso',
        html: `
            <h1>Bem-vindo à Clínica de Cardiologia!</h1>
            <p>Um funcionário acabou de cadastrar você em nosso sistema.</p>
            <p>Para criar sua senha de acesso, clique no link abaixo:</p>
            <a href="${link}" style="color: #007bff; font-weight: bold; text-decoration: none;">Definir minha senha</a>
            <br><br>
            <small>Atenção: Este link expira em 24 horas a partir da data de envio do e-mail.</small>
        `,
    });

    return 'E-mail enviado! Verifique em http://localhost:8025';
}
