export declare class CertificacionesController {
    subirCertificado(file: Express.Multer.File, body: {
        tecnicoId: string;
        titulo: string;
    }): {
        error: string;
        mensaje?: undefined;
        tecnicoId?: undefined;
        titulo?: undefined;
        rutaArchivo?: undefined;
        nombreOriginal?: undefined;
    } | {
        mensaje: string;
        tecnicoId: string;
        titulo: string;
        rutaArchivo: string;
        nombreOriginal: string;
        error?: undefined;
    };
}
