exports.fillEmailTemplate = (template,data) => {
    Object.entries(data).map(([key,value]) => {
        template = template.replace(`{${key}}`,value);
    }) 
    return template;
}