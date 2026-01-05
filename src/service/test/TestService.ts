import { Service } from '@spring4js/container-node'
import log4js from "log4js";

const logger = log4js.getLogger("TestService");
@Service()
export default class TestService {
    sayHi() {
        return 'hi'
    }

}