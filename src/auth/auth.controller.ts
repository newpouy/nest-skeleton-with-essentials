import {
  Controller,
  Request,
  UseGuards,
  Get,
  Post,
  Body,
  Inject,
  UseFilters,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { User } from 'src/users/user.entity';
import { Logger as WinstonLogger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AllCatchFilter } from 'src/AllCatchFilter/AllCatchFilter';
import { TransformInterceptor } from 'src/utils/transform.Intercepter';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtUserAuthGuard } from './jwtuser-auth.guard';

@Controller('auth')
@UseInterceptors(TransformInterceptor)
export class AuthController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    //this.printWinstonLog(req.user); //console.log(req);
    const result = await this.authService.login(req.user);
    return { message: 'Logged in, Successfully', result };
  }

  @Post('signup')
  async signup(@Body() user: User) {
    //this.printWinstonLog(user); //console.log(req);
    const result = await this.authService.signup(user);
    return { message: 'Successful', result };
  }

  @UseGuards(JwtUserAuthGuard)
  @Get('me')
  async mypage(@Req() req) {
    const result = req.user;
    return { message: 'Successful', result };
  }

  @Get('')
  @UseFilters(AllCatchFilter)
  error() {
    console.log('in error');
    //this.printWinstonLog('error'); //console.log(req);
    //return foo.bar();
  }

  private printWinstonLog(req) {
    //console.log(this.logger.info);

    //this.logger.error('error: ', req);
    //this.logger.warn('warn: ', req);
    this.logger.info('info: ', req);
    //this.logger.http('http: ', req);
    //this.logger.verbose('verbose: ', req);
    //this.logger.debug('debug: ', req);
    //this.logger.silly('silly: ', req);
  }
}
