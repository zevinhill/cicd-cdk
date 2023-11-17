import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
//import * as pipelines from 'aws-cdk-lib/pipelines';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { PipelineAppStage } from './demoawspipeline-app-stack';
import { ManualApprovalStep } from 'aws-cdk-lib/pipelines';

export class DemoawspipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const democicdpipeline = new CodePipeline(this, 'demoPipeline', 
    {    
      synth: new ShellStep('Synth', {
        // Use a connection created using the AWS Console to authenticate to GitHub
        // Other sources are available
        input: CodePipelineSource.gitHub('zevinhill/cicd-cdk', 'main'),
        commands: [
          'npm ci',
          'npm run build',
          'npx cdk synth',	
        ],
      }),
    });

    const testingStage = democicdpipeline.addStage(new PipelineAppStage(this, 'test', {
      env: { account: '408177141670', region: 'eu-central-1' }
    }));

    testingStage.addPost(new ManualApprovalStep('Approve'));

    const prodStage = democicdpipeline.addStage(new PipelineAppStage(this, 'prod', {
      env: { account: '408177141670', region: 'eu-central-1'}
    }));

  }
}