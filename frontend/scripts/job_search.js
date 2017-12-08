import * as SkillsGraphics from "./skills_graphics";

export const fetchNormalizedJob = jobString =>
  $.ajax({
    method: "GET",
    url: `http://api.dataatwork.org/v1/jobs/autocomplete?contains=${jobString}`,
    dataType: "json"
  });

export const fetchJobSkills = uuid =>
  $.ajax({
    method: "GET",
    url: `http://api.dataatwork.org/v1/jobs/${uuid}/related_skills`,
    dataType: "json"
  });

let jobsList = [];
let currentJob = [];

export const getJobs = () => jobsList;
export const getJob = () => currentJob;

export const handleJob = payload => {
  jobsList = payload;
  clearSearchResult();
  populateSearchResult(jobsList);
  clearSearchInput();
  // console.log(jobsList);
  return jobsList;
};

export const assignCurrentJob = payload => {
  currentJob = payload;
  // console.log(currentJob);
  SkillsGraphics.renderSkills();
  SkillsGraphics.skillBubbleChart();
  return currentJob;
};

export const receiveJobSkills = uuid => {
  currentJob = [];
  fetchJobSkills(uuid).then(response => assignCurrentJob(response));
};

export const populateSearchResult = jobs => {
  jobs.forEach(job => {
    $("#search-results").append(
      `<li id=${job.uuid}>
        <a data-jobUuid=${job.uuid} href="#">
        ${job.suggestion}</a>
      </li>`
    );
    $(`#${job.uuid}`).click(() => {
      // console.log(job.uuid);
      event.preventDefault();
      return receiveJobSkills(job.uuid);
    });
  });
};

export const clearSearchResult = () => $("#search-results").empty();
export const clearSearchInput = () => $("#search").val("");
