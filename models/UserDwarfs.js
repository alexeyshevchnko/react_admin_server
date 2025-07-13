import mongoose from 'mongoose';

const UserDwarfsSchema = new mongoose.Schema({
    dwarf_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dwarf', // Ссылка на коллекцию dwarves 
        required: true,
        index: true // Индекс определяется здесь
    },
    user_id: {
        type: String,
        required: true,
        index: true // Индекс определяется здесь
    },
    count: {
        type: Number,
        default: 1,
        min: 1
    },
    created_at: {
        type: Number,  
        default: () => Math.floor(Date.now() / 1000),
        index: true // Добавляем индекс, если часто ищем по дате
    }
}, {
    versionKey: '__v',
    collection: 'user_dwarves' // Явное указание имени коллекции
});
 

export const UserDwarfs = mongoose.model('UserDwarfs', UserDwarfsSchema);