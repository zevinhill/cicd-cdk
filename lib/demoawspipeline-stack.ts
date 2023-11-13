import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as pipelines from 'aws-cdk-lib/pipelines';
import { CodePipeline } from 'aws-cdk-lib/aws-events-targets';
import { CodePipelineSource } from 'aws-cdk-lib/pipelines';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DemoawspipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const democicdpipeline = new pipelines.CodePipeline(this, 'demoPipeline', 
    {    
      synth: new pipelines.ShellStep('Synth', {
        // Use a connection created using the AWS Console to authenticate to GitHub
        // Other sources are available
        input: CodePipelineSource.gitHub('zevinhill/cicd-cdk', 'main'),
        commands: [
          'npm ci',
          'npm run build',
          'npm cdk synth',	
        ],
      }),
    });
  }
}