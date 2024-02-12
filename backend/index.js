let express = require("express");
let cors = require("cors");
let app = express();
const dotenv = require('dotenv')
dotenv.config();
app.use(cors());
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE, PATCH',
    allowedHeaders: 'Content-Type',
}));

app.use(express.static("public"))

let LeaveRouter = require("./Route/LeaveRouter.js")



app.get('/', async (req, res) => {
    res.send("Server is Running clearly")
})

app.use('/Leave', LeaveRouter)




app.listen(5000);