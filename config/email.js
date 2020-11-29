const emailTemplates = {};

emailTemplates.WELCOME = `
<html>
    <body>
        <div>
            <p>Olá, <strong>{name}</strong>!</p>
            <br>
            <img src="https://warehousemapp.s3.amazonaws.com/logo8.png" alt="WarehouseApp Logo">
            <p>Seja bem vindo à WarehouseApp, {number}</p>
        </div>
    </body>
</html>
`

module.exports = { 
    sendgridKey: process.env.SENDGRID_KEY, 
    emailTemplates 
};
