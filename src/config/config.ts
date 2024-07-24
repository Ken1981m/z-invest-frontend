const environments = [
    {
        name: 'local',
        predicate: ({ hostname }: Location) => hostname === 'localhost'
    },
    { 
        name: 'prod', 
        predicate: ({ host }: Location) => host.includes(`azurewebsites`) }
    ];
    
    export function runtimeEnvironment(): string {
        const env = environments.find((e) => e.predicate(window.location));
        if (!env) throw new Error('Unable to determine runtime environment');
        return env.name;
    }
    
    export type Config = { zInvestBackendUrl: string };
    
    export const config: Config = {
        ...(process.env.config as unknown as { [key: string]: Config })[runtimeEnvironment()],
    };