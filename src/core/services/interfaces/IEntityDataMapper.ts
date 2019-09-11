export default interface IEntityDataMapper<TDto, TEntity> {
    toDto(entity: TEntity): TDto;
    toDalEntity(dto: TDto): TEntity;
}
