  const express = require('express');
  const mongoose = require('mongoose');
  const bodyParser = require('body-parser');
  const cors = require('cors');
  const ExcelJS = require('exceljs');

  const app = express();

  mongoose.connect('mongodb://localhost:27017/contact_form_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  })

  const messageSchema = new mongoose.Schema({
      firstName: String,
      lastName: String,
      email: String,
      company: String,
      phoneNumber: Number,
      message: String,
  });

  const Message = mongoose.model('Message', messageSchema);

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(express.json());
  app.use(cors());

  app.post('/messages', async (req, res) => {
      try {
        const message = new Message(req.body);
        await message.save();
        res.status(201).json({ message: 'Message saved successfully' });
      } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'An error occurred while saving the message' });
      }
  });

  app.post('/tabledata', (req, res) => {
    const initialTableData = req.body;
    const pos = [" ","PO1","PO2","PO3","PO4","PO5","PO6","PO7","PO8","PO9"];

    if (Array.isArray(initialTableData)) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('co_po_data');

      worksheet.addRow(pos);
      worksheet.addRows(initialTableData);
      
      worksheet.getCell('A1').font = { bold: true };
      worksheet.getRow(1).font = { bold: true };
      for (let j = 2; j <= 10; j++) {
        worksheet.getCell(1, j).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF00' }, 
        };
      }
      for (let i = 2; i <= 7; i++) {
        worksheet.getCell(i, 1).font = { bold: true };
          worksheet.getCell(i, 1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF00' }, 
          };
      }
      worksheet.addRow();
      worksheet.addRow();

      const po1 = ["po1","Engineering knowledge: Apply the knowledge of mathematics, science, engineering fundamentals, and an engineering specialisation for the solution of complex engineering problems."];
      worksheet.addRow(po1);

      const po2 = ["po2","Problem analysis: Identify, formulate, research literature, and analyse complex engineering problems reaching substantiated conclusions using first principles of mathematics, natural sciences, and engineering sciences."];
      worksheet.addRow(po2);

      const po3 = ["po3","Design/Development of Solutions: Design solutions for complex engineering problems and design system components or processes that meet the specified needs with appropriate consideration for public health and safety, and cultural, societal, and environmental considerations."];
      worksheet.addRow(po3);

      const po4 = ["po4","Conduct investigations of complex problems: Use research-based knowledge and research methods including design of experiments, analysis and interpretation of data, and synthesis of the information to provide valid conclusions."];
      worksheet.addRow(po4);

      const po5 = ["po5","Modern tool usage: Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools including prediction and modelling to complex engineering activities with an understanding of the limitations."];
      worksheet.addRow(po5);

      const po6 = ["po6","The engineer and society: Apply reasoning informed by the contextual knowledge to assess societal, health, safety, legal, and cultural issues and the consequent responsibilities relevant to the professional engineering practice."];
      worksheet.addRow(po6);

      const po7 = ["po7","Environment and sustainability: Understand the impact of the professional engineering solutions in societal and environmental contexts, and demonstrate the knowledge of, and the need for sustainable development."];
      worksheet.addRow(po7);

      const po8 = ["po8","Ethics: Apply ethical principles and commit to professional ethics and responsibilities and norms of the engineering practice."];
      worksheet.addRow(po8);

      const po9 = ["po9","Individual and team work: Function effectively as an individual, and as a member or leader in diverse teams, and in multidisciplinary settings."];
      worksheet.addRow(po9);

      workbook.xlsx
        .writeFile('data.xlsx')
        .then(() => {
          console.log('Excel file created successfully.');
          res.status(200).json({ message: 'Excel file created successfully' });
        })
        .catch(error => {
          console.error('Error creating Excel file:', error);
          res.status(500).json({ error: 'An error occurred while creating the Excel file' });
        });
    } else {
      res.status(400).json({ error: 'Request data is not an array' });
    }
  });


  app.post("/blooms",(req,res)=>{
    const { totalMarks, totalSum } = req.body;

    if (totalMarks === 0) {
      return res.status(400).json({ error: 'TotalSum should not be zero.' });
    }

    const result = totalSum / totalMarks;
    console.log("Blooms taxonomy : ",result);
  });


  app.listen(3001, () => {
  console.log(`Server is running on port`);
  }); 