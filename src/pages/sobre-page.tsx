export function SobrePage() {
    return (
        <div className="flex h-full flex-col gap-6">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        Gestão de Currículos de Egressos do IFAL
                    </h1>
                    <p className="text-sm leading-6 text-muted-foreground">
                        Sobre - Conheça o projeto e a equipe envolvida.
                    </p>
                </div>
                <div className="flex flex-col gap-3">
                    <h3 className="font-bold">
                        Este projeto foi implementado na disciplina de Projeto Integrador II (período 2026.1) do curso de Bacharelado em Sistemas de Informação
                        no <i>campus</i> Maceió do Instituto Federal de Alagoas, ministrada pelo Prof. Dr. Edison Camilo de Moraes Júnior.
                    </h3>
                    <div>
                        <p className="text-muted-foreground">São integrantes da equipe:</p>
                        <ul className="list-disc list-inside text-sm">
                            <li>Eike Fabrício da Silva</li>
                            <li>Hugo Alexandre dos Santos</li>
                            <li>João Henrique Barbosa Fernandes Alencar</li>
                            <li>Matheus Alexandre Tenório Matta</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
