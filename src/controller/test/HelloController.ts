import { Context, Next } from 'koa'
import { Controller, HttpMethod, Path, Resource } from '@spring4js/container-node'
import TestService from 'service/test/TestService';

@Controller(`/syj`)
export default class HelloController  {

  @Resource()
  private testService!: TestService

  @Path("hi", HttpMethod.GET)
  async hi(ctx: Context, next: Next) {
    const content = this.testService.sayHi()
    return {
     text: content
    };
  }
}
