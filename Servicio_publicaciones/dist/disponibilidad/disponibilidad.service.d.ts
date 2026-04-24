import { CreateDisponibilidadDto } from './dto/create-disponibilidad.dto';
import { UpdateDisponibilidadDto } from './dto/update-disponibilidad.dto';
export declare class DisponibilidadService {
    create(createDisponibilidadDto: CreateDisponibilidadDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateDisponibilidadDto: UpdateDisponibilidadDto): string;
    remove(id: number): string;
}
