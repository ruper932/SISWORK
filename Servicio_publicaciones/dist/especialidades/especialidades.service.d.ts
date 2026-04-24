import { CreateEspecialidadeDto } from './dto/create-especialidade.dto';
import { UpdateEspecialidadeDto } from './dto/update-especialidade.dto';
export declare class EspecialidadesService {
    create(createEspecialidadeDto: CreateEspecialidadeDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateEspecialidadeDto: UpdateEspecialidadeDto): string;
    remove(id: number): string;
}
