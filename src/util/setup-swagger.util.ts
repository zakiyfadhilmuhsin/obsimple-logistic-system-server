import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupSwagger(app: INestApplication): void {
    const options = new DocumentBuilder()
        .setTitle('Obsimple Logistic System Documentation')
        .setContact(
            'Zakiy Fadhil Muhsin',
            'https://zakiyfadhilmuhsin.com',
            'contact@zakiyfadhilmuhsin.com'
        )
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('documentation', app, document);
}