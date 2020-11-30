const emailTemplates = {};

emailTemplates.WELCOME = `
<html>
    <body>
        <div>
            <p>Olá, <strong>{userName}</strong>!</p>
            <p>Seja bem vindo à WarehouseApp</p>
            <br>
            <img src="https://warehousemapp.s3.amazonaws.com/logo8.png" alt="WarehouseApp Logo">
        </div>
    </body>
</html>
`

module.exports = { 
    sendgridKey: process.env.SENDGRID_KEY, 
    emailTemplates 
};
