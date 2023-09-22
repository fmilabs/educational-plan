import { SetMetadata } from '@nestjs/common';

export const IS_DEV_KEY = 'isDev';
export const Dev = () => SetMetadata(IS_DEV_KEY, true);