import { Body, Controller, Logger, Post, Request, UseGuards,Get, Delete, Put, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/user/interface/user.interface';
import { TagsInterface } from './interface/tag.interface';
import { TagsService } from './tags.service';

@ApiTags('tag')
@ApiBearerAuth()
@Controller('tag')
export class TagsController {

    private logger = new Logger('TagController');

    constructor(private readonly tagsService: TagsService){}

    @UseGuards(JwtAuthGuard)
    @hasRoles(UserRole.ADMIN)
    @Post()
    created(@Body() tagsInterface: TagsInterface, @Request() req) : Observable<TagsInterface>{
        return this.tagsService.cratedTags(tagsInterface);
    }

    @UseGuards(JwtAuthGuard)
    @hasRoles(UserRole.ADMIN)
    @Get()
    findAll() : Observable<TagsInterface[]> {
        return this.tagsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Observable<TagsInterface> {
        return this.tagsService.findOne(id);
    }


    @UseGuards(JwtAuthGuard, RolesGuard)
    @hasRoles(UserRole.ADMIN)
    @Put(':id')
    updateOne(@Param('id') id: number, @Body() categoriesIntf: TagsInterface):
    Observable<TagsInterface> {
        return this.tagsService.updateOne(Number(id), categoriesIntf);

    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @hasRoles(UserRole.ADMIN)
    @Delete(':id')
    deleteOne(@Param('id') id: number): Observable<any> {
        return this.tagsService.deleteOne(id);
    }

}
