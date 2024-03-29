import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { UserModule } from './modules/user/user.module';

export const AllModules = [UserModule, AuthenticationModule, CloudinaryModule];
