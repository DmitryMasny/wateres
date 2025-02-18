import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateRoleDto } from 'src/roles/dto/create-role.dto';
import { RolesService } from 'src/roles/roles.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Role } from './roles.model';

@ApiTags('Роли')
@Controller('roles')
@ApiBearerAuth('JWT-auth')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @ApiOperation({ summary: 'Создание роли' })
  @ApiResponse({ status: 200, type: Role })
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  @ApiOperation({ summary: 'Получение роли по значению' })
  @ApiResponse({ status: 200, type: Role })
  @Get('/:value')
  getByValue(@Param('value') value: string) {
    return this.roleService.getRoleByValue(value);
  }

  @ApiOperation({ summary: 'Получение всех ролей' })
  @ApiResponse({ status: 200, type: [Role] })
  @Get()
  getAll() {
    return this.roleService.getAllRoles();
  }
}
