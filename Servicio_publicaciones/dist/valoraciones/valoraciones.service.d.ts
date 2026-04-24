import { CreateValoracioneDto } from './dto/create-valoracione.dto';
import { UpdateValoracioneDto } from './dto/update-valoracione.dto';
export declare class ValoracionesService {
    create(createValoracioneDto: CreateValoracioneDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateValoracioneDto: UpdateValoracioneDto): string;
    remove(id: number): string;
}
