import { CreateCertificacioneDto } from './dto/create-certificacione.dto';
import { UpdateCertificacioneDto } from './dto/update-certificacione.dto';
export declare class CertificacionesService {
    create(createCertificacioneDto: CreateCertificacioneDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateCertificacioneDto: UpdateCertificacioneDto): string;
    remove(id: number): string;
}
