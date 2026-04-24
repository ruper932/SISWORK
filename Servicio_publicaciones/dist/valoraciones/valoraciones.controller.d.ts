import { ValoracionesService } from './valoraciones.service';
import { CreateValoracioneDto } from './dto/create-valoracione.dto';
import { UpdateValoracioneDto } from './dto/update-valoracione.dto';
export declare class ValoracionesController {
    private readonly valoracionesService;
    constructor(valoracionesService: ValoracionesService);
    create(createValoracioneDto: CreateValoracioneDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateValoracioneDto: UpdateValoracioneDto): string;
    remove(id: string): string;
}
