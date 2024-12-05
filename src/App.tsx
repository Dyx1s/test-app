import React from "react";


interface Param {
    id: number;
    name: string;
    type: "string";
}

interface ParamValue {
    paramId: number;
    value: string;
}

type Color = string;

interface Model {
    paramValues: ParamValue[];
    colors: Color[];
}

interface Props {
    params: Param[];
    model: Model;
}

interface State {
    paramValues: ParamValue[];
    errors: { [key: number]: string };
}


class ParamEditor extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            paramValues: props.model.paramValues,
            errors: {}
        };
    }

    public getModel(): Model {
        return {
            ...this.props.model,
            paramValues: this.state.paramValues
        };
    }

    handleInputChange = (paramId: number, newValue: string) => {
        // Если строка пустая, добавляем ошибку в state
        if (newValue.trim() === "") {
            this.setState((prevState) => ({
                errors: {
                    ...prevState.errors,
                    [paramId]: "Это поле не может быть пустым"  // Устанавливаем ошибку
                }
            }));
        } else {
            // Если строка не пустая, удаляем ошибку
            this.setState((prevState) => {
                const { [paramId]: removedError, ...remainingErrors } = prevState.errors;
                return { errors: remainingErrors };
            });
        }

        this.setState((prevState) => ({
            paramValues: prevState.paramValues.map((paramValue) =>
                paramValue.paramId === paramId
                    ? { ...paramValue, value: newValue }
                    : paramValue
            )
        }));
    };

    render() {
        const { params } = this.props;
        const { paramValues, errors } = this.state;

        return (
            <div>
                <h2>Редактор параметров</h2>
                <form>
                    {params.map((param) => {
                        // Находим значение для текущего параметра
                        const value =
                            paramValues.find((pv) => pv.paramId === param.id)?.value || "";
                        return (
                            <div key={param.id} style={{ marginBottom: "20px" }}>
                                <label>
                                    {param.name}:
                                    <input
                                        type="text"
                                        value={value}
                                        onChange={(e) =>
                                            this.handleInputChange(param.id, e.target.value)
                                        }
                                        style={{
                                            marginLeft: "10px",
                                            borderColor: errors[param.id] ? "red" : "initial"
                                        }}
                                    />
                                </label>
                                {errors[param.id] && (
                                    <div style={{ color: "red", fontSize: "12px" }}>
                                        {errors[param.id]}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </form>
            </div>
        );
    }
}

// Пример
const params: Param[] = [
    { id: 1, name: "Назначение", type: "string" },
    { id: 2, name: "Длина", type: "string" }
];

const initialModel: Model = {
    paramValues: [
        { paramId: 1, value: "повседневное" },
        { paramId: 2, value: "макси" }
    ],
    colors: ["red", "blue"]
};

class App extends React.Component {
    editorRef = React.createRef<ParamEditor>();

    handleSave = () => {
        if (this.editorRef.current) {
            const updatedModel = this.editorRef.current.getModel();
            console.log("Обновленная модель:", updatedModel);
        }
    };

    render() {
        return (
            <div>
                <ParamEditor ref={this.editorRef} params={params} model={initialModel} />
                <button onClick={this.handleSave} style={{ marginTop: "10px" }}>
                    Сохранить
                </button>
            </div>
        );
    }
}

export default App;
