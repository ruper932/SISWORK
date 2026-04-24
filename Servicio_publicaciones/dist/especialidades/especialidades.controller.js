"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EspecialidadesController = void 0;
const common_1 = require("@nestjs/common");
const especialidades_service_1 = require("./especialidades.service");
const create_especialidade_dto_1 = require("./dto/create-especialidade.dto");
const update_especialidade_dto_1 = require("./dto/update-especialidade.dto");
let EspecialidadesController = class EspecialidadesController {
    especialidadesService;
    constructor(especialidadesService) {
        this.especialidadesService = especialidadesService;
    }
    create(createEspecialidadeDto) {
        return this.especialidadesService.create(createEspecialidadeDto);
    }
    findAll() {
        return this.especialidadesService.findAll();
    }
    findOne(id) {
        return this.especialidadesService.findOne(+id);
    }
    update(id, updateEspecialidadeDto) {
        return this.especialidadesService.update(+id, updateEspecialidadeDto);
    }
    remove(id) {
        return this.especialidadesService.remove(+id);
    }
};
exports.EspecialidadesController = EspecialidadesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_especialidade_dto_1.CreateEspecialidadeDto]),
    __metadata("design:returntype", void 0)
], EspecialidadesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EspecialidadesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EspecialidadesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_especialidade_dto_1.UpdateEspecialidadeDto]),
    __metadata("design:returntype", void 0)
], EspecialidadesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EspecialidadesController.prototype, "remove", null);
exports.EspecialidadesController = EspecialidadesController = __decorate([
    (0, common_1.Controller)('especialidades'),
    __metadata("design:paramtypes", [especialidades_service_1.EspecialidadesService])
], EspecialidadesController);
//# sourceMappingURL=especialidades.controller.js.map