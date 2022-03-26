const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');
require('dotenv').config()

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({ helpers });

const sess = {
    secret: process.env.COOKIE_SECRET,
    cookie:{},
    resave:false,
    saveUninitialized:true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

hbs.handlebars.registerHelper('idCheck', function(id1,id2){
    console.log(id1)
    console.log(id2)
    if(id1!==id2){
        return "hide";
    }
});

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({force:false}).then(() => {
    app.listen(PORT, () => console.log(`Now listening at port ${PORT}.`));
});