import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/schemas/user.schemas'; // <-- UserRole a été retiré
import { UsersService } from 'src/users/users.service'; 

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>, 
    private jwtService: JwtService,
    private usersService: UsersService, 
  ) {}

  // --- Méthodes Locales (Existantes) ---

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (user && user.password && await bcrypt.compare(password, user.password)) {
      const userObject = user.toObject();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = userObject;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      userId: user._id.toString(), 
      role: user.role,
    };
    return {
      user: user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: any) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUser) {
        throw new Error('Utilisateur déjà existant'); 
    }
    
    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return newUser.save();
  }
  
  // --- NOUVELLE Méthode Google Auth ---
  
  async handleGoogleLogin(googleUser: any): Promise<{ user: User, access_token: string }> {
    let user = await this.userModel.findOne({ email: googleUser.email }); 
    
    if (!user) {
      const newUser = await this.userModel.create({
        email: googleUser.email,
        nom: googleUser.lastName,
        prenom: googleUser.firstName,
        isVerified: true, 
        role: 'JOUEUR', 
      });
      user = newUser;
    }
    
    const userObject = user.toObject();
    
    const payload = { 
      email: userObject.email, 
      userId: userObject._id.toString(), 
      role: userObject.role, 
    };

    return {
      user: userObject,
      access_token: this.jwtService.sign(payload),
    };
  }

  /**
   * Trouve ou crée un utilisateur via OAuth (Google / Facebook)
   */
  async findOrCreateOAuthUser(profile: {
    provider?: string;
    providerId?: string;
    email?: string;
    givenName?: string;
    familyName?: string;
    displayName?: string;
    picture?: string;
  }): Promise<any> {
    const { provider, providerId } = profile;
    let email = profile.email;

    // ✅ fallback si le provider ne renvoie pas d'email
    if (!email) {
      email = `${providerId}@${provider}.local`;
    }

    // 🔹 Recherche d'abord par provider et providerId
    let user = await this.userModel.findOne({
      provider: provider,
      providerId: providerId,
    });

    // Si l'utilisateur existe déjà avec ce provider
    if (user) {
      // Google/Facebook garantissent déjà la vérification de l'email
      // On marque donc l'email comme vérifié automatiquement
      if (!user.emailVerified) {
        user.emailVerified = true;
        await user.save();
      }
      
      const userObject = user.toObject();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = userObject;
      return result;
    }

    // 🔹 Si l'utilisateur n'existe pas, chercher par email (pour lier un compte existant)
    user = await this.userModel.findOne({ email });

    if (user) {
      // Si l'utilisateur existe mais n'a pas de provider, on le lie
      if (!user.provider || !user.providerId) {
        user.provider = provider;
        user.providerId = providerId;
        await user.save();
      }
      
      // Google/Facebook garantissent déjà la vérification de l'email
      // On marque donc l'email comme vérifié automatiquement
      if (!user.emailVerified) {
        user.emailVerified = true;
        await user.save();
      }
      
      const userObject = user.toObject();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = userObject;
      return result;
    }

    // 🔹 Créer un nouvel utilisateur
    const prenom = profile.givenName || profile.displayName || '';
    const nom = profile.familyName || '';
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Google et Facebook garantissent déjà la vérification de l'email
    // On marque donc l'email comme vérifié automatiquement
    const newUser = new this.userModel({
      prenom,
      nom,
      email,
      password: hashedPassword,
      picture: profile.picture || '',
      provider,
      providerId,
      role: 'JOUEUR',
      age: new Date('1970-01-01'),
      tel: 0,
      // Google/Facebook garantissent déjà la vérification de l'email
      emailVerified: true,
    });

    const savedUser = await newUser.save();
    console.log('✅ Nouvel utilisateur OAuth créé:', savedUser.email, 'Provider:', provider, '- Email automatiquement vérifié');
    
    const userObject = savedUser.toObject();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = userObject;
    return result;
  }
}