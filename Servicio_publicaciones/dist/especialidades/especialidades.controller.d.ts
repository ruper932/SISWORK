import { EspecialidadesService } from './especialidades.service';
import { CreateEspecialidadeDto } from './dto/create-especialidade.dto';
import { UpdateEspecialidadeDto } from './dto/update-especialidade.dto';
export declare class EspecialidadesController {
    private readonly especialidadesService;
    constructor(especialidadesService: EspecialidadesService);
    create(createEspecialidadeDto: CreateEspecialidadeDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateEspecialidadeDto: UpdateEspecialidadeDto): string;
    remove(id: string): string;
}
