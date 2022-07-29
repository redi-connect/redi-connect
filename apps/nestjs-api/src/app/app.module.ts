import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { GraphQLModule } from '@nestjs/graphql'
import { AuthModule } from '../auth/auth.module'
import { ConMenteeFavoritedMentorsModule } from '../con-mentee-favorited-mentors/con-mentee-favorited-mentors.module'
import { ConMentoringSessionsModule } from '../con-mentoring-sessions/con-mentoring-sessions.module'
import { ConMentorshipMatchesModule } from '../con-mentorship-matches/con-mentorship-matches.module'
import { ConProblemReportModule } from '../con-problem-report/con-problem-report.module'
import { ConProfilesModule } from '../con-profiles/con-profiles.module'
import { EmailModule } from '../email/email.module'
import { SfApiModule } from '../salesforce-api/sf-api.module'
import { SalesforceRecordEventsListenerModule } from '../salesforce-record-events-listener/salesforce-record-events-listener.module'
import { TpCompanyProfilesModule } from '../tp-company-profiles/tp-company-profiles.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [
    AuthModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // autoSchemaFile: join(__dirname, '..', '..', 'schema.gql'),
      autoSchemaFile: true,
      sortSchema: true,
      playground: true,
      debug: true,
    }),
    ConProfilesModule,
    ConMentoringSessionsModule,
    ConMentorshipMatchesModule,
    ConMenteeFavoritedMentorsModule,
    ConProblemReportModule,
    TpCompanyProfilesModule,
    EmailModule,
    SfApiModule,
    SalesforceRecordEventsListenerModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
