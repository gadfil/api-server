import {User} from '../user/index'
import {Account} from '../account/index'
import {validate} from "class-validator";
import {Service} from "typedi";
import {Connection} from "typeorm";
import {InjectConnection} from "typeorm-typedi-extensions";

@Service()
class AuthService{
    @InjectConnection()
    private connection: Connection;

}