import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { UserEntity } from 'src/entities/user.entity';
import { Repository,Like } from 'typeorm';
import { UserInterface, UserRole, VerficationsInterface } from './interface/user.interface';
import {paginate, Pagination, IPaginationOptions} from 'nestjs-typeorm-paginate';
import { Verifications } from 'src/entities/verfications.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository : Repository<UserEntity>,
        @InjectRepository(Verifications)
        private readonly verification: Repository<Verifications>,
        private authService : AuthService,
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) {}

    create(user: UserInterface):  Observable<UserInterface> {
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                const newUser = new UserEntity();
                newUser.name = user.name;
                newUser.username = user.username;
                newUser.email = user.email;
                newUser.password = passwordHash;
                newUser.role = UserRole.USER;
                return from(this.userRepository.save(newUser)).pipe(
                    map((user: UserInterface) => {
                        const {password, ...result} = user;
                        return result;
                    }),
                    catchError(err => throwError(err))
                )
            })
        )
    }

    findOne(id: number): Observable<UserInterface> {
        return from(this.userRepository.findOne({id}, {relations: ['PostEntries']})).pipe(
            map((user: UserInterface) => {
                const {password, ...result} = user;
                return result;
            } )
        )
    }

    findAll(): Observable<UserInterface[]> {
        return from(this.userRepository.find()).pipe(
            map((users: UserInterface[]) => {
                users.forEach(function (v) {delete v.password});
                return users;
            })
        );
    }

    paginate(options: IPaginationOptions): Observable<Pagination<UserInterface>> {
        return from(paginate<UserInterface>(this.userRepository, options)).pipe(
            map((usersPageable: Pagination<UserInterface>) => {
                usersPageable.items.forEach(function (v) {delete v.password});
                return usersPageable;
            })
        )
    }

    paginateFilterByUsername(options: IPaginationOptions, user: UserInterface): Observable<Pagination<UserInterface>>{
        return from(this.userRepository.findAndCount({
            skip: Number(options.page) * Number(options.limit) || 0,
            take: Number(options.limit) || 10,
            order: {id: "ASC"},
            select: ['id', 'name', 'username', 'email', 'role'],
            where: [
                { username: Like(`%${user.username}%`)}
            ]
        })).pipe(
            map(([users, totalUsers]) => {
                const usersPageable: Pagination<UserInterface> = {
                    items: users,
                    links: {
                        first: options.route + `?limit=${options.limit}`,
                        previous: options.route + ``,
                        next: options.route + `?limit=${options.limit}&page=${Number(options.page) + 1}`,
                        last: options.route + `?limit=${options.limit}&page=${Math.ceil(totalUsers / Number(options.limit))}`
                    },
                    meta: {
                        currentPage: Number(options.page),
                        itemCount: users.length,
                        itemsPerPage: Number(options.limit),
                        totalItems: totalUsers,
                        totalPages: Math.ceil(totalUsers / Number(options.limit))
                    }
                };              
                return usersPageable;
            })
        )
    }

    deleteOne(id: number): Observable<any> {
        return from(this.userRepository.delete(id));
    }

    updateOne(id: number, user: UserInterface): Observable<any> {
        delete user.email;
        delete user.password;
        delete user.role;

        return from(this.userRepository.update(id, user)).pipe(
            switchMap(() => this.findOne(id))
        );
    }

    updateRoleOfUser(id: number, user: UserInterface): Observable<any> {
        return from(this.userRepository.update(id, user));
    }

    login(user: UserInterface): Observable<string> {
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user: UserInterface) => {
                if(user) {
                    return this.authService.generateJWT(user).pipe(map((jwt: string) => jwt));
                } else {
                    return 'Wrong Credentials';
                }
            })
        )
    }

    validateUser(email: string, password: string): Observable<UserInterface> {
        return from(this.userRepository.findOne({email}, {select: ['id', 'password', 'name', 'username', 'email', 'role', 'profileImage']})).pipe(
            switchMap((user: UserInterface) => this.authService.comparePasswords(password, user.password).pipe(
                map((match: boolean) => {
                    if(match) {
                        const {password, ...result} = user;
                        return result;
                    } else {
                        throw Error;
                    }
                })
            ))
        )

    }

    findByMail(email: string): Observable<UserInterface> {
        return from(this.userRepository.findOne({email}));
    } 
    
    async emailAuth({code,}: {code: string;}): Promise<{ ok: boolean; message: string }> {
        try {
          const verification = await this.verification.findOne(
            { code },
            { relations: ['user'] },
          );
          if (verification) {
            verification.user.verified = true;
            this.userRepository.save(verification.user);
          }
          // Delete email verification code and grant verification code validity period
          return {
            ok: true,
            message: '!Please log in to get started',
          };
        } catch (error) {
          console.log(error);
          return {
            ok: false,
            message: 'Email authentication failed. please try again',
          };
        }
      }

      async sendMail(email: string, code: string, name: string) {
        try {
          await this.mailerService.sendMail({
            to: email, // list of receivers
            from: `${this.configService.get<string>('EMAIL_ID')}@johan.com`, // sender address
            subject: 'Email verification request email.', // Subject line
            html: `
            <h3>  hello ${name}  </>
            <a href="http://localhost:3000/auth/email/?code=${code}">Verification Link</a>`, // HTML body content
          });
          return { ok: true };
        } catch (error) {
          console.log(error);
        }
      }

}
