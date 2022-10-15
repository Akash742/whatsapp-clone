import * as Controller from "../app/controllers";
import * as Validation from "../utility/validation";

const applyRoutes = (app) => {

    app.get('/', (req, res) => res.send("API is running fine"));


    app.post("/user", Validation.validateCreateUser, Controller.createUser);
    app.post("/channel", Validation.validateCreateChannel, Controller.createChannel);
    app.get("/search-user", Validation.validateSearchUser, Controller.searchUser);
    app.get("/channel-list", Validation.validateGetChannelList, Controller.getChannelList);
    app.post("/message", Validation.validateAddMessage, Controller.sendMessage);
}

export default applyRoutes;