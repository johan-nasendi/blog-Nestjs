import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/user/interface/user.interface';
import { CategoriesService } from './categories.service';
import { CategoryInterface } from './interface/category.interface';

@ApiTags('category')
@ApiBearerAuth()
@Controller('category')
export class CategoriesController {

    constructor(private readonly categoryService : CategoriesService){}

    @UseGuards(JwtAuthGuard)
    @hasRoles(UserRole.ADMIN)
    @Post()
    created(@Body()categoriesIntf: CategoryInterface, @Request() req): Observable<CategoryInterface> {
        return this.categoryService.createdCaregory(categoriesIntf);
    }

    @UseGuards(JwtAuthGuard)
    @hasRoles(UserRole.ADMIN)
    @Get(':id')
    findOne(@Param('id') id: number) : Observable<CategoryInterface> {
        return this.categoryService.findOne(id);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @hasRoles(UserRole.ADMIN)
    @Get()
    findAll(categoriesIntf: CategoryInterface) : Observable<CategoryInterface[]> {
        return this.categoryService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @hasRoles(UserRole.ADMIN)
    @Put(':id')
    updateOne(@Param('id') id: number, @Body() categoriesIntf: CategoryInterface):
    Observable<CategoryInterface> {
        return this.categoryService.updateOne(Number(id), categoriesIntf);

    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @hasRoles(UserRole.ADMIN)
    @Delete(':id')
    deleteOne(@Param('id') id: number): Observable<any> {
        return this.categoryService.deleteOne(id);
    }


   



}
