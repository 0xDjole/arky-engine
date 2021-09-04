import { ICoreCategoryInput } from 'services'

export default [
    {
        name: 'wine bar',
        image: `${process.env.S3_URL}/icons/wine.png`
    },
    {
        name: 'restaurant',
        image: `${process.env.S3_URL}/icons/restaurant.png`
    },
    {
        name: 'cafe',
        image: `${process.env.S3_URL}/icons/cafe.png`
    },
    {
        name: 'pizza',
        image: `${process.env.S3_URL}/icons/pizza.png`
    },
    {
        name: 'bowling alleys',
        image: `${process.env.S3_URL}/icons/bowling.png`
    },
    {
        name: 'breakfast',
        image: `${process.env.S3_URL}/icons/breakfast.png`
    },
    {
        name: 'nightclub',
        image: `${process.env.S3_URL}/icons/disco.png`
    },
    {
        name: 'bar',
        image: `${process.env.S3_URL}/icons/bar.png`
    },
    {
        name: 'sweets',
        image: `${process.env.S3_URL}/icons/sweets.png`
    }
] as ICoreCategoryInput[]
