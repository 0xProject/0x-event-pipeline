import "reflect-metadata";
import {createConnection, ConnectionOptions} from "typeorm";
import * as ormConfig from './ormconfig';

createConnection(ormConfig as ConnectionOptions).then(async connection => {

    console.log("App is running...");

}).catch(error => console.log(error));
