import { ConfigService } from "@nestjs/config";
import * as admin from 'firebase-admin';


export const firebaseProvider = {
  provide: 'FIREBASE_APP', 
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
        clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
        privateKey: configService
          .get<string>('FIREBASE_PRIVATE_KEY')
          ?.replace(/\\n/g, '\n'), //Added this cos env would escape newlines in the priv key. 
      }),
    });
  },
};
