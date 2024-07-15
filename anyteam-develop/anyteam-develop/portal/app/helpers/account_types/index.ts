export const accountTypes = [
    { id: 1, name: '普通預金' },
    { id: 2, name: '貯蓄預金' },
    { id: 3, name: '当座預金' },
]

export const getAccountTypeById = (id: number): string => {
    const accountType = accountTypes.find(type => type.id === id);
    return accountType ? accountType.name : '';
}