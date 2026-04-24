import { DisponibilidadService } from './disponibilidad.service';
import { CreateDisponibilidadDto } from './dto/create-disponibilidad.dto';
import { UpdateDisponibilidadDto } from './dto/update-disponibilidad.dto';
export declare class DisponibilidadController {
    private readonly disponibilidadService;
    constructor(disponibilidadService: DisponibilidadService);
    create(createDisponibilidadDto: CreateDisponibilidadDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateDisponibilidadDto: UpdateDisponibilidadDto): string;
    remove(id: string): string;
}
