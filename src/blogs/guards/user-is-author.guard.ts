import { CanActivate, Injectable, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { switchMap, map } from "rxjs/operators";
import { UserInterface } from "src/user/interface/user.interface";
import { UserService } from "src/user/user.service";
import { PostInterface } from "../posts/interface/post-entry.interface";
import { PostsService } from "../posts/posts.service";

@Injectable()
export class  UserIsAuthorGuard implements CanActivate {

    constructor(
        private userService: UserService, 
        private blogService: PostsService
        ) {}

    canActivate(context: ExecutionContext): Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        const params = request.params;
        const blogEntryId: number = Number(params.id);
        const user: UserInterface = request.user;

        return this.userService.findOne(user.id).pipe(
            switchMap((user: UserInterface) => this.blogService.findOne(blogEntryId).pipe(
                map((blogEntry: PostInterface) => {
                    let hasPermission = false;

                    if(user.id === blogEntry.author.id) {
                        hasPermission = true;
                    }

                    return user && hasPermission;
                })
            ))
        )       
    }
}